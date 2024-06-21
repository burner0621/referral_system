// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import { IERC20 } from "./interfaces/IERC20.sol";
import { ROwnable } from "./access/ROwnable.sol";

contract ReferralSystem is ROwnable {
    address[] private _users;
    IERC20 public quoteToken;
    
    address public platformWallet;
    mapping (address => address) private _referrals;
    mapping (address => uint256) private _addressToLevel;
    mapping (address => bool) private _isDone;
    mapping (uint256 => address) private _ids;

    uint[12] private plans = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 7500, 9000, 10000];
    uint private index = 0;

    constructor(address _quoteToken, address _platformWallet) {
        require (_quoteToken != address(0) && _platformWallet != address(0), "Wrong address.");
        quoteToken = IERC20(_quoteToken);
        platformWallet = _platformWallet;
    }

    function enterPlan(uint _level, uint _id) external {
        require(_level < 12, "Wrong plan level.");
        require(index > _id, "Wrong referral id parameter.");
        require(_isDone[msg.sender] == false, "Can't join twice.");

        _isDone[msg.sender] = true;
        _addressToLevel[msg.sender] = _level;
        _ids[index] = msg.sender;
        
        uint256 decimals = quoteToken.decimals();
        uint256 amount = plans[_level] * 10 ** decimals;
        quoteToken.transferFrom(msg.sender, address(this), amount);
        
        address _ref = _ids[_id];
        
        if (_ref != address(0)) {
            uint256 first_referrer_level = _addressToLevel[_ref];
            uint first_pay_level = _level < first_referrer_level ? _level : first_referrer_level;
            uint first_pay_amount = plans[first_pay_level] * 10 ** decimals / 2;
            _referrals[msg.sender] = _ref;
            quoteToken.transfer(_ref, first_pay_amount);

            address second_referrer = _referrals[_ref];
            if (second_referrer != address(0)) {

                uint256 second_referrer_level = _addressToLevel[second_referrer];

                uint second_pay_level = _level < second_referrer_level ? _level : second_referrer_level;
                uint second_pay_amount = plans[second_pay_level] * 10 ** decimals / 4;

                quoteToken.transfer(second_referrer, second_pay_amount);
                quoteToken.transfer(platformWallet, amount - first_pay_amount - second_pay_amount);
            } else {
                quoteToken.transfer(platformWallet, amount - first_pay_amount);
            }
        }

        index = index + 1;
    }

    function setPlatformWallet(address _platformWallet) onlyOwner external {
        platformWallet = _platformWallet;
    }

    function setQuoteToken(address _quoteToken) onlyOwner external {
        quoteToken = IERC20(_quoteToken);
    }
}
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./IdentityRegistry.sol";
import "./compliance/Compliance.sol";

/**
 * @title SecurityToken
 * @dev ERC-3643 compliant token for real estate tokenization
 * Only verified investors can hold/transfer tokens
 */
contract SecurityToken is ERC20, Ownable, Pausable {
    
    IdentityRegistry public identityRegistry;
    Compliance public compliance;
    
    // Token metadata
    string private tokenURI;
    uint8 private immutable _decimals;
    
    // Freeze functionality
    mapping(address => bool) private frozen;
    
    event IdentityRegistrySet(address indexed registry);
    event ComplianceSet(address indexed compliance);
    event TokensFrozen(address indexed investor);
    event TokensUnfrozen(address indexed investor);
    event Issued(address indexed to, uint256 amount);
    event Redeemed(address indexed from, uint256 amount);
    event ForcedTransfer(address indexed from, address indexed to, uint256 amount);
    
    modifier onlyVerified(address _investor) {
        require(identityRegistry.isVerified(_investor), "Investor not verified");
        _;
    }
    
    modifier notFrozen(address _investor) {
        require(!frozen[_investor], "Tokens are frozen");
        _;
    }
    
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 __decimals,
        address _identityRegistry,
        address _compliance,
        string memory _tokenURI
    ) ERC20(_name, _symbol) Ownable(msg.sender) {
        require(_identityRegistry != address(0), "Invalid identity registry");
        require(_compliance != address(0), "Invalid compliance");
        
        _decimals = __decimals;
        identityRegistry = IdentityRegistry(_identityRegistry);
        compliance = Compliance(_compliance);
        tokenURI = _tokenURI;
    }
    
    /**
     * @dev Returns the number of decimals
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @dev Issue tokens to verified investor
     */
    function issue(address _to, uint256 _amount) external onlyOwner onlyVerified(_to) whenNotPaused {
        _mint(_to, _amount);
        emit Issued(_to, _amount);
    }
    
    /**
     * @dev Redeem tokens from investor
     */
    function redeem(address _from, uint256 _amount) external onlyOwner whenNotPaused {
        _burn(_from, _amount);
        emit Redeemed(_from, _amount);
    }
    
    /**
     * @dev Force transfer (for compliance/recovery)
     */
    function forcedTransfer(
        address _from,
        address _to,
        uint256 _amount
    ) external onlyOwner onlyVerified(_to) whenNotPaused returns (bool) {
        _transfer(_from, _to, _amount);
        emit ForcedTransfer(_from, _to, _amount);
        return true;
    }
    
    /**
     * @dev Freeze investor's tokens
     */
    function freeze(address _investor) external onlyOwner {
        frozen[_investor] = true;
        emit TokensFrozen(_investor);
    }
    
    /**
     * @dev Unfreeze investor's tokens
     */
    function unfreeze(address _investor) external onlyOwner {
        frozen[_investor] = false;
        emit TokensUnfrozen(_investor);
    }
    
    /**
     * @dev Pause all token operations
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token operations
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Set identity registry
     */
    function setIdentityRegistry(address _identityRegistry) external onlyOwner {
        require(_identityRegistry != address(0), "Invalid address");
        identityRegistry = IdentityRegistry(_identityRegistry);
        emit IdentityRegistrySet(_identityRegistry);
    }
    
    /**
     * @dev Set compliance module
     */
    function setCompliance(address _compliance) external onlyOwner {
        require(_compliance != address(0), "Invalid address");
        compliance = Compliance(_compliance);
        emit ComplianceSet(_compliance);
    }
    
    /**
     * @dev Set token URI (metadata)
     */
    function setTokenURI(string memory _uri) external onlyOwner {
        tokenURI = _uri;
    }
    
    /**
     * @dev Get token URI
     */
    function getTokenURI() external view returns (string memory) {
        return tokenURI;
    }
    
    /**
     * @dev Check if investor is frozen
     */
    function isFrozen(address _investor) external view returns (bool) {
        return frozen[_investor];
    }
    
    /**
     * @dev Override transfer to add compliance checks
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override whenNotPaused notFrozen(from) notFrozen(to) {
        // Allow minting (from == address(0)) and burning (to == address(0))
        if (from != address(0) && to != address(0)) {
            // Verify both parties
            require(identityRegistry.isVerified(from), "Sender not verified");
            require(identityRegistry.isVerified(to), "Receiver not verified");
            
            // Check compliance
            uint16 fromCountry = identityRegistry.investorCountry(from);
            uint16 toCountry = identityRegistry.investorCountry(to);
            uint256 toBalance = balanceOf(to);
            
            require(
                compliance.canTransfer(from, to, value, fromCountry, toCountry, toBalance),
                "Transfer not compliant"
            );
        }
        
        super._update(from, to, value);
    }
}

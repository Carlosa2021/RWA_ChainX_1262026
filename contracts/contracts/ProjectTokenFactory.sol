// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./erc3643/SecurityToken.sol";
import "./erc3643/IdentityRegistry.sol";
import "./erc3643/compliance/Compliance.sol";
import "./PayoutDistributor.sol";

/**
 * @title IProjectRegistry
 * @dev Interface for ProjectRegistry
 */
interface IProjectRegistry {
    function registerProject(
        string memory _name,
        address _securityToken,
        address _investmentController,
        uint256 _pricePerToken,
        uint256 _maxCap,
        address _stablecoin,
        string memory _metadataURI
    ) external returns (uint256);
}

/**
 * @title ProjectTokenFactory
 * @dev Factory for deploying ERC-3643 tokens + InvestmentController + PayoutDistributor
 * Creates complete project setup in one transaction
 */
contract ProjectTokenFactory is Ownable {
    
    IdentityRegistry public immutable identityRegistry;
    Compliance public immutable compliance;
    IProjectRegistry public immutable projectRegistry;
    
    event ProjectCreated(
        uint256 indexed projectId,
        address indexed securityToken,
        address indexed investmentController,
        address payoutDistributor,
        string name
    );
    
    constructor(
        address _identityRegistry,
        address _compliance,
        address _projectRegistry
    ) Ownable(msg.sender) {
        require(_identityRegistry != address(0), "Invalid identity registry");
        require(_compliance != address(0), "Invalid compliance");
        require(_projectRegistry != address(0), "Invalid project registry");
        
        identityRegistry = IdentityRegistry(_identityRegistry);
        compliance = Compliance(_compliance);
        projectRegistry = IProjectRegistry(_projectRegistry);
    }
    
    /**
     * @dev Create a complete project (token + distributor)
     * @param _name Token name (e.g., "Property Madrid Centro")
     * @param _symbol Token symbol (e.g., "PMC")
     * @param _decimals Number of decimals (0 for indivisible tokens)
     * @param _pricePerToken Price per token in EUR cents
     * @param _maxCap Maximum tokens to issue
     * @param _stablecoin Stablecoin address (USDC/EURC)
     * @param _metadataURI IPFS URI for legal docs
     */
    function createProject(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _pricePerToken,
        uint256 _maxCap,
        address _stablecoin,
        string memory _metadataURI
    ) external onlyOwner returns (
        address tokenAddress,
        address controller,
        address distributorAddress,
        uint256 projectId
    ) {
        // 1. Deploy SecurityToken (ERC-3643)
        SecurityToken token = new SecurityToken(
            _name,
            _symbol,
            _decimals,
            address(identityRegistry),
            address(compliance),
            _metadataURI
        );
        
        // 2. Deploy InvestmentController (usar el existente con EUR/USD feed)
        // Note: InvestmentController debe desplegarse separadamente ya que tiene lógica específica
        // Para este factory, solo retornamos address(0) como placeholder
        address controllerAddr = address(0);
        
        // 3. Deploy PayoutDistributor
        PayoutDistributor distributor = new PayoutDistributor(
            address(token),
            _stablecoin
        );
        
        // 4. Transfer token ownership to deployer (quien debe configurar el controller)
        token.transferOwnership(msg.sender);
        
        // 5. Register project in ProjectRegistry
        projectId = projectRegistry.registerProject(
            _name,
            address(token),
            controllerAddr,  // placeholder, admin debe configurar después
            _pricePerToken,
            _maxCap,
            _stablecoin,
            _metadataURI
        );
        
        emit ProjectCreated(
            projectId,
            address(token),
            controllerAddr,
            address(distributor),
            _name
        );
        
        return (
            address(token),
            controllerAddr,
            address(distributor),
            projectId
        );
    }
    
    /**
     * @dev Create multiple projects in batch
     */
    function createProjects(
        string[] memory _names,
        string[] memory _symbols,
        uint8[] memory _decimals,
        uint256[] memory _prices,
        uint256[] memory _caps,
        address[] memory _stablecoins,
        string[] memory _uris
    ) external onlyOwner returns (uint256[] memory projectIds) {
        require(_names.length == _symbols.length, "Length mismatch");
        require(_names.length == _decimals.length, "Length mismatch");
        require(_names.length == _prices.length, "Length mismatch");
        require(_names.length == _caps.length, "Length mismatch");
        require(_names.length == _stablecoins.length, "Length mismatch");
        require(_names.length == _uris.length, "Length mismatch");
        
        projectIds = new uint256[](_names.length);
        
        for (uint256 i = 0; i < _names.length; i++) {
            (, , , uint256 projectId) = this.createProject(
                _names[i],
                _symbols[i],
                _decimals[i],
                _prices[i],
                _caps[i],
                _stablecoins[i],
                _uris[i]
            );
            
            projectIds[i] = projectId;
        }
    }
}

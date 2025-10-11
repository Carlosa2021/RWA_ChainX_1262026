// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ProjectRegistry
 * @dev Registry of all real estate projects
 */
contract ProjectRegistry is Ownable {
    
    struct Project {
        string name;
        address securityToken;
        address investmentController;
        uint256 pricePerToken;
        uint256 maxCap;
        address stablecoin;
        string metadataURI; // IPFS link to legal docs
        bool active;
        uint256 createdAt;
    }
    
    // Array of all projects
    Project[] private projects;
    
    // Mapping: token address => project index
    mapping(address => uint256) private tokenToIndex;
    
    event ProjectCreated(
        uint256 indexed projectId,
        string name,
        address indexed securityToken,
        address indexed investmentController
    );
    event ProjectUpdated(uint256 indexed projectId);
    event ProjectDeactivated(uint256 indexed projectId);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Register a new project
     */
    function registerProject(
        string memory _name,
        address _securityToken,
        address _investmentController,
        uint256 _pricePerToken,
        uint256 _maxCap,
        address _stablecoin,
        string memory _metadataURI
    ) external onlyOwner returns (uint256) {
        require(_securityToken != address(0), "Invalid token address");
        require(_investmentController != address(0), "Invalid controller address");
        
        uint256 projectId = projects.length;
        
        projects.push(Project({
            name: _name,
            securityToken: _securityToken,
            investmentController: _investmentController,
            pricePerToken: _pricePerToken,
            maxCap: _maxCap,
            stablecoin: _stablecoin,
            metadataURI: _metadataURI,
            active: true,
            createdAt: block.timestamp
        }));
        
        tokenToIndex[_securityToken] = projectId;
        
        emit ProjectCreated(projectId, _name, _securityToken, _investmentController);
        
        return projectId;
    }
    
    /**
     * @dev Update project metadata
     */
    function updateProject(
        uint256 _projectId,
        uint256 _pricePerToken,
        uint256 _maxCap,
        string memory _metadataURI
    ) external onlyOwner {
        require(_projectId < projects.length, "Invalid project ID");
        
        Project storage project = projects[_projectId];
        project.pricePerToken = _pricePerToken;
        project.maxCap = _maxCap;
        project.metadataURI = _metadataURI;
        
        emit ProjectUpdated(_projectId);
    }
    
    /**
     * @dev Deactivate a project
     */
    function deactivateProject(uint256 _projectId) external onlyOwner {
        require(_projectId < projects.length, "Invalid project ID");
        projects[_projectId].active = false;
        emit ProjectDeactivated(_projectId);
    }
    
    /**
     * @dev Get project by ID
     */
    function getProject(uint256 _projectId) external view returns (Project memory) {
        require(_projectId < projects.length, "Invalid project ID");
        return projects[_projectId];
    }
    
    /**
     * @dev Get all projects
     */
    function getAllProjects() external view returns (Project[] memory) {
        return projects;
    }
    
    /**
     * @dev Get active projects only
     */
    function getActiveProjects() external view returns (Project[] memory) {
        // Count active projects
        uint256 activeCount = 0;
        for (uint256 i = 0; i < projects.length; i++) {
            if (projects[i].active) {
                activeCount++;
            }
        }
        
        // Create array of active projects
        Project[] memory activeProjects = new Project[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < projects.length; i++) {
            if (projects[i].active) {
                activeProjects[index] = projects[i];
                index++;
            }
        }
        
        return activeProjects;
    }
    
    /**
     * @dev Get project count
     */
    function getProjectCount() external view returns (uint256) {
        return projects.length;
    }
    
    /**
     * @dev Get project ID by token address
     */
    function getProjectByToken(address _token) external view returns (uint256) {
        return tokenToIndex[_token];
    }
}

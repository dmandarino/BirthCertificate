pragma solidity 0.5.8;

contract BirthCertificate {
    // Model a Certificate
    struct Certificate {
        uint id;
        string name;
    }
    
    // Read/write Candidates
    mapping(uint => Certificate) public certificates;
    // Store Candidates Count
    uint public certificateCount;

    constructor() public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }
    
    function addCandidate (string memory _name) private {
        certificateCount ++;
        certificates[certificateCount] = Certificate(certificateCount, _name);
    }

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        // require(!voters[msg.sender]);

        // // require a valid candidate
        // require(_candidateId > 0 && _candidateId <= certificateCount);

        // // record that voter has voted
        // voters[msg.sender] = true;

        // // update candidate vote Count
        // candidates[_candidateId].voteCount ++;
    }
}
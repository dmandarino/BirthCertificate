pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;
import './BirthCertificate.sol';
// import { certificate} from './BirthCertificate.sol';

contract Notary {

     // Model a Certificate
    struct Certificate {
        uint id;
        uint registration;
        Child child;
        GrandParents grandParents;
    }

    struct Child {
        string name;
        string city;
        string gender;
        string father;
        string mother;
    }

    struct GrandParents {
        string paternalGrandfather;
        string paternalGrandmother;
        string maternalGrandfather;
        string maternalGrandmother;
        string witness;
    }
    
    // Read/write Candidates
    mapping(uint => BirthCertificate.Certificate) public certificates;
    uint public certificateCount;
    
    constructor() public {
        
    }

    function createCertificate ( uint _registration,
                                string memory _name,
                                string memory _city,
                                string memory _gender,
                                string memory _father,
                                string memory _mother,
                                string memory _paternalGrandfather,
                                string memory _paternalGrandmother,
                                string memory _maternalGrandfather,
                                string memory _maternalGrandmother,
                                string memory _witness ) private {

        certificateCount ++;
        certificates[certificateCount] = BirthCertificate.Certificate(certificateCount,
                                                    _registration,
                                                    _name,
                                                    _city,
                                                    _gender,
                                                    _father,
                                                    _mother,
                                                    _paternalGrandfather,
                                                    _paternalGrandmother,
                                                    _maternalGrandfather,
                                                    _maternalGrandmother,
                                                    _witness);
    }

    function vote (uint _candidateId) public {
        // // require that they haven't voted before
        // require(!voters[msg.sender]);

        // // require a valid candidate
        // require(_candidateId > 0 && _candidateId <= certificateCount);

        // // record that voter has voted
        // voters[msg.sender] = true;

        // // update candidate vote Count
        // candidates[_candidateId].voteCount ++;
    }
}
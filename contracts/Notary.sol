pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;

contract Notary {

    event createdEvent (
        uint indexed _code
    );

   struct Certificate {
        uint code;
        string name;
        string city;
        string gender;
        string father;
        string mother;
        string paternalGrandfather;
        string paternalGrandmother;
        string maternalGrandfather;
        string maternalGrandmother;
        string witness;
    }
    // Read/write Certificates
    mapping(uint => Certificate) public certificates;
    uint public certificateCount;

    constructor() public {}

    function createCertificate ( uint _code,
                                string memory _name,
                                string memory _city,
                                string memory _gender,
                                string memory _father,
                                string memory _mother,
                                string memory _paternalGrandfather,
                                string memory _paternalGrandmother,
                                string memory _maternalGrandfather,
                                string memory _maternalGrandmother,
                                string memory _witness ) public {

        certificateCount ++;
        Certificate memory certificate;
        certificate.code = _code;
        certificate.name = _name;
        certificate.city = _city;
        certificate.gender = _gender;
        certificate.father = _father;
        certificate.mother = _mother;
        certificate.paternalGrandfather = _paternalGrandfather;
        certificate.paternalGrandmother = _paternalGrandmother;
        certificate.maternalGrandfather = _maternalGrandfather;
        certificate.maternalGrandmother = _maternalGrandmother;
        certificate.witness = _witness;

        validateCertificate(certificate);

        certificates[_code] = certificate;
        
        emit createdEvent(_code);
    }

    function validateCertificate(Certificate memory certificate) private {
        require(certificate.code != 0, 'code must not be empty');
        require(bytes(certificate.name).length > 0, 'name must not be empty');
        require(bytes(certificate.city).length > 0, 'city must not be empty');
        bytes memory gender = bytes(certificate.gender);
        require(keccak256(gender) == keccak256('M') || keccak256(gender) == keccak256('F'), 'gender must not be M or F');
        require(bytes(certificate.father).length > 0, 'father must not be empty');
        require(bytes(certificate.mother).length > 0, 'mother must not be empty');
        require(bytes(certificate.paternalGrandfather).length > 0, 'paternalGrandfather must not be empty');
        require(bytes(certificate.paternalGrandmother).length > 0, 'paternalGrandmother must not be empty');
        require(bytes(certificate.maternalGrandfather).length > 0, 'maternalGrandfather must not be empty');
        require(bytes(certificate.maternalGrandmother).length > 0, 'maternalGrandmother must not be empty');
        require(bytes(certificate.witness).length > 0, 'witness must not be empty');

        for ( uint i = 0; i < certificateCount; i++ ) {
            require(certificates[i].code != certificate.code, 'code must be unique');
        }
    }
}
pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;

contract BirthCertificate {

    struct Certificate {
        uint id;
        uint registration; 
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

    Certificate public certificate;

    constructor() public {}
}
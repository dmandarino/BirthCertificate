var Notary = artifacts.require("./Notary.sol");

contract("Notary", function(accounts) {
  var notaryInstance;

  it("create a Birth Certificate", function() {
    return Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      notaryInstance.createBirthCertificate(99,
                                          'Bruce Wayne',
                                          'Gotham City',
                                          'M',
                                          'Thomas Wayne',
                                          'Martha Wayne',
                                          'Grandfather Wayne',
                                          'Grandmother Wayne',
                                          'Grandfather Mother',
                                          'Grandmother Mother',
                                          'Douglas Mandarino',
                                          { from: accounts[1] });
      return notaryInstance.birthCertificates(1);
    }).then(function(certificate) {
      assert.equal(certificate.registration, 99, "Create a Crtificate");
      assert.equal(certificate.name, 'Bruce Wayne', "Create a Crtificate");
      assert.equal(certificate.city, 'Gotham City', "Create a Crtificate");
      assert.equal(certificate.gender, 'M', "Create a Crtificate");
      assert.equal(certificate.father, 'Thomas Wayne', "Create a Crtificate");
      assert.equal(certificate.mother, 'Martha Wayne', "Create a Crtificate");
      assert.equal(certificate.paternalGrandfather, 'Grandfather Wayne', "Create a Crtificate");
      assert.equal(certificate.paternalGrandmother, 'Grandmother Wayne', "Create a Crtificate");
      assert.equal(certificate.maternalGrandfather, 'Grandfather Mother', "Create a Crtificate");
      assert.equal(certificate.maternalGrandmother, 'Grandmother Mother', "Create a Crtificate");
      assert.equal(certificate.witness, 'Douglas Mandarino', "Create a Crtificate");
    });
  });

  it("throws an exception for empty field", function() {
    return Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      return notaryInstance.createBirthCertificate(99,
                                            '',
                                            'Gotham City',
                                            'M',
                                            'Thomas Wayne',
                                            'Martha Wayne',
                                            'Grandfather Wayne',
                                            'Grandmother Wayne',
                                            'Grandfather Mother',
                                            'Grandmother Mother',
                                            'Douglas Mandarino',
                                            { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('name must not be empty') >= 0, 'name must not be empty');
    });
  });

  it("throws an exception for invalid gender", function() {
    return Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      return notaryInstance.createBirthCertificate(99,
                                            'Bruce Wayne',
                                            'Gotham City',
                                            'T',
                                            'Thomas Wayne',
                                            'Martha Wayne',
                                            'Grandfather Wayne',
                                            'Grandmother Wayne',
                                            'Grandfather Mother',
                                            'Grandmother Mother',
                                            'Douglas Mandarino',
                                            { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('gender must not be M or F') >= 0, 'gender must not be M or F');
    });
  });

  it("throws an exception for duplicated certification number", function() {
    return Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      notaryInstance.createBirthCertificate(99,
                                          'Bruce Wayne',
                                          'Gotham City',
                                          'M',
                                          'Thomas Wayne',
                                          'Martha Wayne',
                                          'Grandfather Wayne',
                                          'Grandmother Wayne',
                                          'Grandfather Mother',
                                          'Grandmother Mother',
                                          'Douglas Mandarino',
                                          { from: accounts[1] });
      return notaryInstance.birthCertificates(1);
    }).then(function(certificate) {
        assert.equal(certificate.registration, 99, "Create a Crtificate");
        notaryInstance.createBirthCertificate(99,
                                          'Peter Parker',
                                          'New York',
                                          'M',
                                          'Mr Parker',
                                          'Mrs Parker',
                                          'Grandfather Parker',
                                          'Grandmother Parker',
                                          'Grandfather Parker',
                                          'Grandmother Parker',
                                          'Douglas Mandarino',
                                          { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      // assert(error.message.indexOf('revert') >= 0, 'registration must be unique');
    });
  });
});
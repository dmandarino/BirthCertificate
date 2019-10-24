App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Notary.json", function(notary) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Notary = TruffleContract(notary);
      // Connect provider to interact with contract
      App.contracts.Notary.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
  
    loader.show();
    content.hide();
  
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Endereço do Cartório: " + account);
      }
    });
  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },
  
  listenForEvents: function() {
    App.contracts.Notary.deployed().then(function(instance) {
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  initContract: function() {
    $.getJSON("Notary.json", function(notary) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Notary = TruffleContract(notary);
      // Connect provider to interact with contract
      App.contracts.Notary.setProvider(App.web3Provider);

      return App.render();
    });
  },

  createCertificate: function() {
    const name = $('#name').val();
    const city = $('#city').val();
    const father = $('#father').val();
    const mother = $('#mother').val();
    const paternalGrandfather = $('#paternalGrandfather').val();
    const paternalGrandmother = $('#paternalGrandmother').val();
    const maternalGrandfather = $('#maternalGrandfather').val();
    const maternalGrandmother = $('#maternalGrandmother').val();
    const witness = $('#witness').val();
    const gender = $('input[name="gender"]:checked').val();

    alert(gender)

    var notaryInstance;
    var newCertificateCode;

    App.contracts.Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      return notaryInstance.certificateCount();
    }).then(function(count) {
      const codePosition = count.toString();
      return notaryInstance.certificates(codePosition);
    }).then(function(certificate) {
      const lastCode = certificate[0].toString();
      return parseInt(lastCode) + 1;
    }).then(function(newCode) {
      console.log(newCode)
      newCertificateCode = newCode;
      return notaryInstance.createCertificate(newCode,
                                       name,
                                       city,
                                       gender,
                                       father,
                                       mother,
                                       paternalGrandfather,
                                       paternalGrandmother,
                                       maternalGrandfather,
                                       maternalGrandmother,
                                       witness,
                                       { from: App.account, gas:3000000 });
    }).then(function() {
      console.log('saved')
      $("#certificateCode").html("Matrícula: " + newCertificateCode);
    }).catch(function(err) {
      console.error(err);
    });
  },

  searchCertificate: function() {
    const search = $('#searchID').val();
    
    var notaryInstance;
    var codePosition;
    
    return App.contracts.Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      return notaryInstance.getCertificateKey(search);
    }).then(function(codeKey) {
      codePosition = codeKey.toString();
      return notaryInstance.certificates(codePosition);
    }).then(function(certificate) {
      App.showValues(certificate[0], certificate[1], certificate[2], certificate[3], certificate[4], certificate[5], 
                    certificate[6], certificate[7], certificate[8], certificate[9], certificate[10]);
    }).catch(function(err) {
      console.error(err);
    });
  },

  showValues: function(code, name, city, gender, father, mother, paternalGrandfather, 
                      paternalGrandmother, maternalGrandfather, maternalGrandmother, witness) {
    if (code == 0) {
      $("#certificateCode").html("Nenhuma Certidão encontrada para matrícula: " + code);
    } else {
      $('input[type="text"], textarea').attr('readonly','readonly');
      $('#searchID').prop('readonly', false);
      $(':radio,:checkbox').click(function() {
        return false;
      });
      $("#certificateCode").html("Matrícula: " + code);
      $("#name").val(name);
      $("#city").val(city);
      $("#father").val(father);
      $("#mother").val(mother);
      $("#paternalGrandfather").val(paternalGrandfather);
      $("#paternalGrandmother").val(paternalGrandmother);
      $("#maternalGrandfather").val(maternalGrandfather);
      $("#maternalGrandmother").val(maternalGrandmother);
      $("#witness").val(witness);
      var $radios = $('input:radio[name=gender]');
      if (gender === 'M') {
        $radios.filter('[value=M]').prop('checked', true);
      } else {
        $radios.filter('[value=F]').prop('checked', true);
      }
    }
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

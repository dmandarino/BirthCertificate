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
    // $.getJSON("Election.json", function(election) {
    //   // Instantiate a new truffle contract from the artifact
    //   App.contracts.Election = TruffleContract(election);
    //   // Connect provider to interact with contract
    //   App.contracts.Election.setProvider(App.web3Provider);

    //   return App.render();
    // });

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
        $("#accountAddress").html("Your Account: " + account);
      }
    });
  
    // Load contract data
  //   App.contracts.Election.deployed().then(function(instance) {
  //     electionInstance = instance;
  //     return electionInstance.candidatesCount();
  //   }).then(function(candidatesCount) {
  //     var candidatesResults = $("#candidatesResults");
  //     candidatesResults.empty();
  
  //     var candidatesSelect = $('#candidatesSelect');
  //     candidatesSelect.empty();
  
  //     for (var i = 1; i <= candidatesCount; i++) {
  //       electionInstance.candidates(i).then(function(candidate) {
  //         var id = candidate[0];
  //         var name = candidate[1];
  //         var voteCount = candidate[2];
  
  //         // Render candidate Result
  //         var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
  //         candidatesResults.append(candidateTemplate);
  
  //         // Render candidate ballot option
  //         var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
  //         candidatesSelect.append(candidateOption);
  //       });
  //     }
  //     return electionInstance.voters(App.account);
  //   }).then(function(hasVoted) {
  //     // Do not allow a user to vote
  //     if(hasVoted) {
  //       $('form').hide();
  //     }
  //     loader.hide();
  //     content.show();
  //   }).catch(function(error) {
  //     console.warn(error);
  //   });
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
    // App.contracts.Election.deployed().then(function(instance) {
    //   instance.votedEvent({}, {
    //     fromBlock: 0,
    //     toBlock: 'latest'
    //   }).watch(function(error, event) {
    //     console.log("event triggered", event)
    //     // Reload when a new vote is recorded
    //     App.render();
    //   });
    // });
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
    // $.getJSON("Election.json", function(election) {
    //   // Instantiate a new truffle contract from the artifact
    //   App.contracts.Election = TruffleContract(election);
    //   // Connect provider to interact with contract
    //   App.contracts.Election.setProvider(App.web3Provider);
  
    //   App.listenForEvents();
  
    //   return App.render();
    // });

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
    // const name = $('#name').val();
//     App.contracts.Notary.deployed().then(function(instance) {
//         return instance.createCertificate(2,
//                                          name,
//                                          city,
//                                          'M',
//                                          father,
//                                          mother,
//                                          paternalGrandfather,
//                                          paternalGrandmother,
//                                          maternalGrandfather,
//                                          maternalGrandmother,
//                                          witness,
//                                          { from: App.account, gas:3000000 });
//       }).then(function() {
//         console.log('salvei')
//       }).catch(function(err) {
//         console.error(err);
//       });
      
    App.contracts.Notary.deployed().then(function(instance) {
      return instance.createCertificate(1,
                                       name,
                                       city,
                                       'M',
                                       father,
                                       mother,
                                       paternalGrandfather,
                                       paternalGrandmother,
                                       maternalGrandfather,
                                       maternalGrandmother,
                                       witness,
                                       { from: App.account, gas:3000000 });
    }).then(function() {
      console.log('salvei')
    }).catch(function(err) {
      console.error(err);
    });
  },

  searchCertificate: function() {
    const search = $('#searchID').val();
    App.contracts.Notary.deployed().then(function(instance) {
      instance.codePosition(1).then(function(codeKey) {
        return instance.certificates(codeKey);
      }).then(function(certificate) {
        assert.equal(certificate[0], 12, "Search for a certificate");
        assert.equal(certificate[1], 'Damian Wayne', "Search for a certificate");
      });
    }); 
    // App.contracts.Notary.deployed().then(function(instance) {
    //   return instance.certificates(codeKey);
    // }).then(function(certificate) {
    //   assert.equal(certificate[0], 12, "Search for a certificate");
    //   assert.equal(certificate[1], 'Damian Wayne', "Search for a certificate");
    // });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

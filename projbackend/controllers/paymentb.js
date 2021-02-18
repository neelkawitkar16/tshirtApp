const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "tsbv89z332y5sh4f",
  publicKey: "9ckxq2byz47p288n",
  privateKey: "536ec0ec49f91fc00a40f866cca4745b"
});


exports.getToken = (req, res) => {
  gateway.clientToken.generate({  }, (err, response) => {
    // pass clientToken to your front-end
    if(err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
}

exports.processPayment = (req, res) => {

  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheClient = req.nody.amount;

  gateway.transaction.sale({
    amount: amountFromTheClient,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, (err, result) => {
    if(err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
}
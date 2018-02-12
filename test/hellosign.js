var fs = require("fs");
var path = require("path");
var HelloSign = require('hellosign');

var test_mode = true;
var signature_request = new HelloSign.SignatureRequest("YOUR_API_KEY_HERE", test_mode);

var example_file = fs.createReadStream(path.join(__dirname, './files/example.pdf'));
var options = {
  title: "Example Title",
  file:[example_file],
  signers:[
    {
      name: "Example User", 
      email_address: "user@example.com", 
    }
  ]
};
signature_request.send(options).then(function(result){
  var signature_request_id = result.signature_request.signature_request_id;
  console.log("Signature request " + signature_request_id + " sent");
  return signature_request.files({file_type:"pdf", signature_request_id:signature_request_id});
}).then(function(stream){
  var example_pdf_stream = fs.createWriteStream(path.join(__dirname, './files/example-out.pdf'));
  stream.pipe(example_pdf_stream);
  example_pdf_stream.on("finish", function(){
    console.log("Example PDF output downloaded.");
  });
});

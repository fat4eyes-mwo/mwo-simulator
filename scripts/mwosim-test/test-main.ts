
//Creates the test harness for test-index.html. To run tests, go to url
//    test-index.html#<testName>
//where testName is a test method in simulator-test.ts
namespace MechTest {

  const INDEX_HTML_URL = "index.html";
  function loadAppHTMLPromise() : Promise<any> {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url : INDEX_HTML_URL,
        type : 'GET',
        dataType : 'text'
        })
        .done(function(data : any) {
          Util.log("Successfully loaded " + INDEX_HTML_URL);
          resolve(data);
        })
        .fail(function(data : any) {
          Util.log("Request for  " + INDEX_HTML_URL + " request failed: " + Error(data));
          reject(Error(data));
        });
    });
  }

  //Loads the body of the main index.html into test-index.html.
  //NOTE: This relies on the body tags in the main index.html file to be in
  //lower case and have no spaces due to the string.search() calls
  function replaceBody() : Promise<any> {
    return loadAppHTMLPromise().then(function(data : string) {
      let bodyStart = data.search("<body>");
      bodyStart += "<body>".length;
      let bodyEnd = data.search("</body>");
      let bodyStr = data.substr(bodyStart, bodyEnd - bodyStart);
      let appBody = $.parseHTML(bodyStr);
      $("body").append(appBody);
      Util.log("Loaded all HTML");
      return data;
    })
    .catch(function(data : any) {
      Util.error(Error("Error loading app HTML"));
    });
  }

  function runTest() : void {
    let hash = location.hash;
    hash = hash ? hash.substring(1) : null;
    if (hash) {
      if (MechTest.hasOwnProperty(hash)) {
        let testFunc = Reflect.get(MechTest, hash);
        testFunc();
      }
    } else {
      Util.error(Error("No test specified"));
    }
  }

  export function testMain() : void {
    Util.log("testMain started");
    replaceBody().then(function(data : any) {
      runTest();
    })
    .catch(function(data : any) {
      Util.error(Error("Error running test: " + data));
    });
  }
}

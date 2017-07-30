/// <reference path="simulator-test.ts" />
/// <reference path="../scripts/lib/jquery-3.2.d.ts" />

//TODO: See why rootdirs aren't working in tsconfig.json
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
          console.log("Successfully loaded " + INDEX_HTML_URL);
          resolve(data);
        })
        .fail(function(data : any) {
          console.log("Request for  " + INDEX_HTML_URL + " request failed: " + Error(data));
          reject(Error(data));
        });
    });
  }

  //NOTE: This relies on the body tags in the main index.html file to be in
  //lower case and have no spaces due to the string.search calls
  function replaceBody() : Promise<any> {
    return loadAppHTMLPromise().then(function(data : string) {
      let bodyStart = data.search("<body>");
      bodyStart += "<body>".length;
      let bodyEnd = data.search("</body>");
      let bodyStr = data.substr(bodyStart, bodyEnd - bodyStart);
      let appBody = $.parseHTML(bodyStr);
      $("body").append(appBody);
      console.log("Loaded all HTML");
      return data;
    })
    .catch(function(data : any) {
      console.log("Error loading app HTML")
    });
  }

  function runTest() {
    let hash = location.hash;
    hash = hash ? hash.substring(1) : null;
    if (hash) {
      if (MechTest.hasOwnProperty(hash)) {
        let testFunc = Reflect.get(MechTest, hash);
        testFunc();
      }
    } else {
      console.error("No test specified");
    }
  }

  export function testMain() {
    console.log("Hello from test main");
    replaceBody().then(function(data : any) {
      runTest();
    })
    .catch(function(data : any) {
      console.log("Error running test");
    });
  }
}

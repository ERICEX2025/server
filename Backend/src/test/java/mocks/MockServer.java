package mocks;

import static spark.Spark.after;

import edu.brown.cs.student.main.Server.BroadBandHandler;
import edu.brown.cs.student.main.Server.LoadCSVHandler;
import edu.brown.cs.student.main.Server.SearchCSVHandler;
import edu.brown.cs.student.main.Server.ViewCSVHandler;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import spark.Spark;

public class MockServer {

  private static List<List<String>> parsedLoadedCSV;

  private static HashMap<String, String> stateCode;

  public static void main(String[] args) {
    int port = 0;
    Spark.port(port);
    Logger.getLogger("").setLevel(Level.WARNING);
    stateCode = new HashMap<>();
    parsedLoadedCSV = new ArrayList<>();

    /*
       Setting CORS headers to allow cross-origin requests from the client; this is necessary for the client to
       be able to make requests to the server.

       By setting the Access-Control-Allow-Origin header to "*", we allow requests from any origin.
       This is not a good idea in real-world applications, since it opens up your server to cross-origin requests
       from any website. Instead, you should set this header to the origin of your client, or a list of origins
       that you trust.

       By setting the Access-Control-Allow-Methods header to "*", we allow requests with any HTTP method.
    */
    after(
        (request, response) -> {
          response.header("Access-Control-Allow-Origin", "*");
          response.header("Access-Control-Allow-Methods", "*");
        });

    /**
     * loadcsv, which loads a CSV file if one is located at the specified path.
     * viewcsv, which sends back the entire CSV file's contents as a Json 2-dimensional array.
     * searchcsv, which sends back rows matching the given search criteria.
     * broadband, which sends back the broadband data from the ACS API.
     */
    // Setting up the handler for the GET /order and /mock endpoints



  }

  /**
   * getter for loadedCSV
   * @return parsedLoadedCSV, List<List<String>>
   */
  public static List<List<String>> getParsedLoadedCSV() {
    return parsedLoadedCSV;
  }

  /**
   * setter for parsedLoadedCSV, List<List<String>>
   * used in LoadCSV when the user loads the CSV
   */
  public static void setParsedLoadedCSV(List<List<String>> setData) {
    parsedLoadedCSV = setData;
  }

  /**
   * getter for stateCode map
   * @return state code, HashMap<String
   */
  public static HashMap<String, String> getStateCode(){
    return stateCode;
  }

  /**
   * setter for stateCode map called initially to set up the state to state code mappings
   */
  public static void setStateCode(List<List<String>> setStateCode) {
    for(int i = 1; i < setStateCode.size(); i++){
      stateCode.put(setStateCode.get(i).get(0), setStateCode.get(i).get(1));
    }
  }

}

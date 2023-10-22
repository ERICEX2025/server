package edu.brown.cs.student.main.Server;

import static spark.Spark.after;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import spark.Spark;

/**
 * Top-level class. Contains the main() method which starts Spark and runs the various
 * handlers.
 *
 * <p>We have four endpoints in this WebAPI. The loadcsv, viewcsv,and searchcsv endpoints use the
 * shared static variable parsedLoadedCSV to load, view, and search the csvfile.
 *
 * The broadband endpoint uses the static variable stateCode to store the stateCode mappings,
 * preventing redundant "state to stateCode" queries to the census API
 */
public class Server {

  /**
   * private variables static so they can be accessed through getter/setters
   * without instantiating Server
   */
  private static List<List<String>> parsedLoadedCSV;

  private static HashMap<String, String> stateCode;

  public Server(){
    this.stateCode = new HashMap<>();
  }

  public static void main(String[] args) {
    int port = 3232;
    Spark.port(port);
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
    Spark.get("loadcsv", new LoadCSVHandler());
    Spark.get("viewcsv", new ViewCSVHandler());
    Spark.get("searchcsv", new SearchCSVHandler());
    Spark.get("broadband", new BroadBandHandler());
    Spark.init();
    Spark.awaitInitialization();

    System.out.println("Server started at http://localhost:" + port);
  }

  /**
   * getter for loadedCSV
   * @return parsedLoadedCSV, List<List<String>>
   */
  public static List<List<String>> getParsedLoadedCSV() {
    List<List<String>> copyList = new ArrayList<>(parsedLoadedCSV);
    return copyList;
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

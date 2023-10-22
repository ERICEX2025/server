import static org.junit.jupiter.api.Assertions.assertEquals;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import java.io.IOException;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import mocks.MockBroadbandHandler;
import mocks.MockServer;
import mocks.MockedBroadbandData;
import okio.Buffer;
import org.junit.Assert;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Spark;


public class testHandlers {
  private final Type mapStringObject = Types.newParameterizedType(Map.class, String.class, Object.class);
  private JsonAdapter<Map<String, Object>> adapter;


  private static List<List<String>> mockParsedCSV;

  /*
  Initial setup that all our methods will use. For the csvs, we need to intialize an empty
  mock parse list
   */
  @BeforeAll
  public static void setupOnce(){
    Spark.port(0);
    // Eliminate logger spam in console for test suite
    Logger.getLogger("").setLevel(Level.WARNING); // empty name = root
    mockParsedCSV = new ArrayList<>();
  }

  /*
    Setting up that all our methods will use
 */
  @BeforeEach
  public void setup() {
    // Re-initialize parser, state, etc. for every test method

    // Use *MOCKED* data when in this test environment.
    // Notice that the WeatherHandler code doesn't need to care whether it has
    // "real" data or "fake" data. Good separation of concerns enables better testing.

    Spark.get("mockloadcsv", new MockLoadCSVHandler());
    Spark.get("mockviewcsv", new MockViewCSVHandler());
    Spark.get("mocksearchcsv", new MockSearchCSVHandler());
    Spark.get("mockbroadband", new MockSearchCSVHandler());
    Spark.awaitInitialization();

    // New Moshi adapter for responses (and requests, too; see a few lines below)
    //   For more on this, see the Server gearup.
    Moshi moshi = new Moshi.Builder().build();
    adapter = moshi.adapter(mapStringObject);
  }


  /**
   * This sets up the endpoint and connects to it
   * @param apiCall: the api endpoint to our handlers
   * @return: the clientConnection
   * @throws IOException: if the request based on the URL object fails
   */
  private HttpURLConnection tryRequest(String apiCall) throws IOException {
    // Configure the connection (but don't actually send a request yet)
    URL requestURL = new URL("http://localhost:"+Spark.port()+"/"+apiCall);
    HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();
    // The request body contains a Json object
    clientConnection.setRequestProperty("Content-Type", "application/json");
    // We're expecting a Json object in the response body
    clientConnection.setRequestProperty("Accept", "application/json");

    clientConnection.connect();
    return clientConnection;
  }

  /**
   * Stopping all of our execution
   */
  public void tearDown(){
    Spark.unmap("mockloadcsv");
    Spark.unmap("mockviewcsv");
    Spark.unmap("mocksearchcsv");
    Spark.unmap("mockbroadband");
    Spark.awaitStop(); // don't proceed until the server is stopped
  }

  /**
   * Testing our load csv Handler with a mock implementation
   * @throws IOException: throws an exception if the tryRequest fails
   */
  @Test
  public void testLoadCSV() throws IOException {
    HttpURLConnection loadConnection = tryRequest("mockloadcsv?filepath=ri_income.csv");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, loadConnection.getResponseCode());
    // Get the expected response: a success
    Map<String, Object> body = adapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
    assertEquals("success", body.get("result"));
    loadConnection.disconnect();

    //failed load
    HttpURLConnection loadConnection2 = tryRequest("mockloadcsv");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, loadConnection2.getResponseCode());
    // Get the expected response: a success
    Map<String, Object> body2 = adapter.fromJson(new Buffer().readFrom(loadConnection2.getInputStream()));
    assertEquals("error_bad_datasource, CSV File not found in our data folder: null", body2.get("result"));
    loadConnection2.disconnect();
  }

  /**
   * Testing our view csv Handler functionality with a mock implementation
   * @throws IOException: throws an exception if the tryRequest fails
   */
  @Test
  public void testViewCSV() throws IOException {
  //viewing without loading to check that we handle the error case
    HttpURLConnection loadConnection1 = tryRequest("mockviewcsv");
    Map<String, Object> body1 = adapter.fromJson(new Buffer().readFrom(loadConnection1.getInputStream()));
    assertEquals("error_datasource, CSV File datasource not loaded", body1.get("result"));
    loadConnection1.disconnect();

    //now we load a csv
    HttpURLConnection loadConnection = tryRequest("mockloadcsv?filepath=ri_income.csv");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, loadConnection.getResponseCode());
    // Get the expected response: a success
    Map<String, Object> body = adapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
    assertEquals("success", body.get("result"));
    loadConnection.disconnect();

    //trying the same view call, now it should work
    loadConnection1 = tryRequest("mockviewcsv");
    body1 = adapter.fromJson(new Buffer().readFrom(loadConnection1.getInputStream()));
    ArrayList<ArrayList<String>> expected = new ArrayList<>();
    ArrayList<String> val = new ArrayList<>();
    val.add("success");
    expected.add(val);
    assertEquals(expected, body1.get("result"));
    loadConnection1.disconnect();

  }

  /**
   * Testing our view csv Handler functionality with a mock implementation
   * Here we are testing cases that don't work due to faulty queries
   * @throws IOException: throws an exception if the tryRequest fails
   */
  @Test
  public void testSearchCSVFailFromBadArgs() throws IOException {
    //testing with bad arguments for the search
    HttpURLConnection loadConnection = tryRequest("mocksearchcsv?");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, loadConnection.getResponseCode());
    // Get the expected response: a success
    Map<String, Object> body = adapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
    assertEquals("error_bad_request, Please enter a search term", body.get("result"));
    loadConnection.disconnect();

    //now with term, but no hasheader
    HttpURLConnection loadConnection2 = tryRequest("mocksearchcsv?term=Rhode+Island");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, loadConnection2.getResponseCode());
    // Get the expected response: a success
    Map<String, Object> body2 = adapter.fromJson(new Buffer().readFrom(loadConnection2.getInputStream()));
    assertEquals("error_bad_request, Please include a boolean to indicate if the csv has a header row", body2.get("result"));
    loadConnection2.disconnect();

    //now with both, but no file loaded
    HttpURLConnection loadConnection3 = tryRequest("mocksearchcsv?term=Rhode+Island&hasheader=false");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, loadConnection3.getResponseCode());
    // Get the expected response: a success
    Map<String, Object> body3 = adapter.fromJson(new Buffer().readFrom(loadConnection3.getInputStream()));
    assertEquals("error_datasource, CSV File datasource not loaded", body3.get("result"));
    loadConnection3.disconnect();

  }

  /**
   * Testing our view csv Handler functionality in a case where the search is successful
   * @throws IOException: throws an exception if the tryRequest fails
   */
  @Test
  public void testSearchCSV() throws IOException {
    HttpURLConnection loadConnection = tryRequest("mockloadcsv?filepath=ri_income.csv");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, loadConnection.getResponseCode());
    // Get the expected response: a success
    Map<String, Object> body = adapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
    assertEquals("success", body.get("result"));
    loadConnection.disconnect();

    HttpURLConnection loadConnection3 = tryRequest("mocksearchcsv?term=Rhode+Island&hasheader=false");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, loadConnection3.getResponseCode());
    // Get the expected response: a success
    Map<String, Object> body3 = adapter.fromJson(new Buffer().readFrom(loadConnection3.getInputStream()));
    ArrayList<ArrayList<String>> expected = new ArrayList<>();
    ArrayList<String> val = new ArrayList<>();
    val.add("success");
    expected.add(val);
    assertEquals(expected, body3.get("result"));
    loadConnection3.disconnect();
    //contents are [[Rhode Island, 74,489.00, 95,198.00, 39,603.00]], but we couldn't find the
    //object that matched with the reference in data
  }

  /**
   * Testing our BroadBandHandler functionality with a mock implementation
   * that will fail if the query requests are bad
   * @throws IOException: throws an exception if the tryRequest fails
   */
  @Test
  public void testMockBroadbandHandlerFail() throws IOException {
    //adding no state
    HttpURLConnection loadConnection = tryRequest("mockbroadband");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, loadConnection.getResponseCode());
    // Get the expected response: a success
    Map<String, Object> body4 = adapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
    assertEquals("error_bad_request, Please enter a search term", body4.get("result"));
    loadConnection.disconnect();
  }

  public static void setParsedLoadedCSV(List<List<String>> setData) {
    mockParsedCSV = setData;
  }

  public static List<List<String>> getParsedLoadedCSV() {
    return mockParsedCSV;
  }

}

package edu.brown.cs.student.main.Server;

import edu.brown.cs.student.main.Exceptions.CountyDoesNotExistException;
import java.time.LocalDateTime;
import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import java.time.format.DateTimeFormatter;
import okio.Buffer;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.*;

/**
 *  A datasource for broadband data via the ACS Census API.
 */
public class ACSCensusDataSource implements CensusDataSource {

  public ACSCensusDataSource() {}

  /**
   * Private helper method; throws IOException so different callers
   * can handle differently if needed.
   */
  private static HttpURLConnection connect(URL requestURL) throws IOException {
    URLConnection urlConnection = requestURL.openConnection();
    HttpURLConnection clientConnection = (HttpURLConnection) urlConnection;
    clientConnection.connect();
    return clientConnection;
  }

  /**
   * Given a state and county param
   * @return  percentage of broadband data
   */
  @Override
  public BroadbandData getPercentage(String state, String county)
          throws CountyDoesNotExistException {
    try {
      HashMap<String, Object> result = new HashMap();

      String stateCode = Server.getStateCode().get(state);
      CountyToCountyCodeMap countyMap = this.getCounties(stateCode);

      String countyCode = "";
      county += ", " + state;

      LocalDateTime timestamp = LocalDateTime.now();
      // Define a date-time formatter
      DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
      // Convert timestamp to a string with a custom format
      String timestampStr = timestamp.format(formatter);

      //no specified county
      if(county.equals(", " + state)){
        //fix url
        URL requestURL = new URL("https", "api.census.gov", "/data/2021/acs/acs1/subject/variables?get=NAME,S2802_C03_022E&for=county:*&in=state:" + stateCode);
        HttpURLConnection clientConnection = connect(requestURL);
        Moshi moshi = new Moshi.Builder().build();

        JsonAdapter<List<List<String>>> adapter = moshi.adapter(
                Types.newParameterizedType(List.class, Types.newParameterizedType(List.class, String.class)));

        Buffer buffer = new Buffer();

        List<List<String>> body = adapter.fromJson(buffer.readFrom(clientConnection.getInputStream()));

        clientConnection.disconnect();

        List<List<String>> data = new ArrayList<>();
        result.put("data", data);

        for(int i = 1; i < body.size(); i++){
          List<String> row = new ArrayList<>();
          row.add(body.get(i).get(0));
          row.add(": " + body.get(i).get(1));
          data.add(row);
        }

        result.put("time", timestampStr);
        return new BroadbandData(result);
      }

      //for specified county
      else if (countyMap.countyToCountyCodeMap().containsKey(county)) {
        countyCode = countyMap.countyToCountyCodeMap().get(county);
        URL requestURL = new URL("https", "api.census.gov", "/data/2021/acs/acs1/subject/variables?get=NAME,S2802_C03_022E&for=county:" + countyCode + "&in=state:" + stateCode);
        HttpURLConnection clientConnection = connect(requestURL);
        Moshi moshi = new Moshi.Builder().build();


        JsonAdapter<List<List<String>>> adapter = moshi.adapter(
                Types.newParameterizedType(List.class, Types.newParameterizedType(List.class, String.class)));

        Buffer buffer = new Buffer();

        List<List<String>> body = adapter.fromJson(buffer.readFrom(clientConnection.getInputStream()));

        clientConnection.disconnect();

//        result.put(body.get(1).get(0), body.get(1).get(1));

        List<List<String>> data = new ArrayList<>();
        result.put("data", data);
        List<String> row = new ArrayList<>();
        row.add(body.get(1).get(0));
        row.add(": " + body.get(1).get(1));
        data.add(row);
        result.put("time", timestampStr);
        return new BroadbandData(result);

      }

      //for nonexistent county
      else {
        throw new CountyDoesNotExistException("county does not exist");
      }

    } catch (IOException | CountyDoesNotExistException e) {
      throw new CountyDoesNotExistException("county does not exist");
    }
  }

  public CountyToCountyCodeMap getCounties(String stateCode) throws IOException {
    HashMap<String, String> counties = new HashMap<>();
    URL requestURL = new URL("https", "api.census.gov", "/data/2010/dec/sf1?get=NAME&for=county:*&in=state:" + stateCode);
    HttpURLConnection clientConnection = connect(requestURL);
    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<List<List<String>>> adapter = moshi.adapter(
            Types.newParameterizedType(List.class, Types.newParameterizedType(List.class, String.class)));

    Buffer buffer = new Buffer();

    List<List<String>> body = adapter.fromJson(buffer.readFrom(clientConnection.getInputStream()));
    clientConnection.disconnect();


    for(int i = 1; i < body.size(); i++){
      counties.put(body.get(i).get(0), body.get(i).get(2));
    }
    return new CountyToCountyCodeMap(counties);
  }

  public void setMappings() throws IOException {
    //to get all the states and their code
    URL requestURL = new URL("https", "api.census.gov", "/data/2010/dec/sf1?get=NAME&for=state:*");
    HttpURLConnection clientConnection = connect(requestURL);
    Moshi moshi = new Moshi.Builder().build();

    JsonAdapter<List<List<String>>> adapter = moshi.adapter(
            Types.newParameterizedType(List.class, Types.newParameterizedType(List.class, String.class)));
    try {
      Buffer buffer = new Buffer();
      List<List<String>> body;
      body = adapter.fromJson(buffer.readFrom(clientConnection.getInputStream()));
      clientConnection.disconnect();
      assert body != null;
      Server.setStateCode(body);
    }
    catch (IOException e){
      throw new IOException();
    }
  }

  public record CountyToCountyCodeMap(HashMap<String, String> countyToCountyCodeMap){}

  public record Value(String text){}

}
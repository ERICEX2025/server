package edu.brown.cs.student.main.Server;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.Exceptions.CountyDoesNotExistException;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;


/**
 * endpoint that lets the user search the BroadBand percent of households for with broadband access
 * for a specified state and optional specific county through their inputted state and county query
 *
 * returns the rows that result from the search
 * if something fails, either term not found, identifier not found, no state search term, invalid
 * state, or term not found in specified column will be shown in json format as a failure response
 *
 * Example usage:  localhost:3232/broadband?state=California&county=Kings+County
 */
public class BroadBandHandler implements Route {
  @Override
  public Object handle(Request request, Response response) throws IOException {
    HashMap<String, Object> toSend = new HashMap<>();
    String state = request.queryParams("state");

    //if no state param
    if(state == null){
      toSend.put("result", "error_bad_request, please specify a state");
      return new BroadBandFailureResponse(toSend).serialize();
    }

    String county = request.queryParams("county");
    ACSCensusDataSource acsAPI = new ACSCensusDataSource();

    //populate the initial state to stateCode map
    if(Server.getStateCode().isEmpty()){
      acsAPI.setMappings();
    }

    //if state does not exist
    if(!Server.getStateCode().containsKey(state)){
      toSend.put("result", "error_bad_request," + state + " is not a valid state");
      return new BroadBandFailureResponse(toSend).serialize();
    }
    else{
      try {
        //if county is not specified, return data for all counties for that state
        if (county == null) {
          toSend = acsAPI.getPercentage(state, "").broadbandData();
        }
        //return that specific county's data
        else {
          toSend = acsAPI.getPercentage(state, county).broadbandData();
        }
      }
      catch (CountyDoesNotExistException e){
        toSend.put("result", "error_bad_request, " + county + " county does not exist");
        return new BroadBandFailureResponse(toSend).serialize();
      }
      toSend.put("result", "success");
      return new BroadBandSuccessResponse(toSend).serialize();
    }
  }

  public record BroadBandSuccessResponse(HashMap<String, Object> response_type) {
    String serialize() {
      Moshi moshi = new Moshi.Builder().build();
      Type objectStringMap = Types.newParameterizedType(
              Map.class, String.class, Object.class);
      JsonAdapter<Map<String, Object>> adapter = moshi.adapter(objectStringMap);
      return adapter.toJson(response_type);
    }

  }


  public record BroadBandFailureResponse(HashMap<String, Object> response_type) {
    String serialize() {
      Moshi moshi = new Moshi.Builder().build();
      Type objectStringMap = Types.newParameterizedType(Map.class, String.class, Object.class);
      JsonAdapter<Map<String, Object>> adapter = moshi.adapter(objectStringMap);
      return adapter.toJson(response_type);
    }
  }

}
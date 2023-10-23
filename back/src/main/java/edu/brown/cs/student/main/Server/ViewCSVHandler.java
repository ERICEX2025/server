package edu.brown.cs.student.main.Server;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

/**
 * endpoint that lets the user view a loaded csv file
 * returns a key value pair {"result", "success"} when successfully loaded
 * or an error response key valur pair {"result", "the specific error"}
 * in the form of json
 * <p>
 * Example usage: <a href="http://localhost:3232/viewcsv">...</a>
 */
public class ViewCSVHandler implements Route {

  /**
   * Checks if there is an inputted csv file to view, if false, return failure response
   * else turn the loaded and parsed csv file, Server.getParsedLoadedCSV(), into json
   * and return to view
   */
  @Override
  public Object handle(Request request, Response response) {
    HashMap<String, Object> toSend = new HashMap<>();

    if(Server.getParsedLoadedCSV().isEmpty()){
      toSend.put("result", "error_datasource, CSV File datasource not loaded");
      return new ViewCSVFailureResponse(toSend).serialize();
    }

    toSend.put("result", "success");
    toSend.put("data", Server.getParsedLoadedCSV());
    return new ViewCSVSuccessResponse(toSend).serialize();
  }

  public record ViewCSVSuccessResponse(HashMap<String, Object> response_type) {
    String serialize() {
      Moshi moshi = new Moshi.Builder().build();
      Type objectStringMap = Types.newParameterizedType(Map.class, String.class, Object.class);
      JsonAdapter<Map<String, Object>> adapter = moshi.adapter(objectStringMap);
      return adapter.toJson(response_type);
    }

  }

  public record ViewCSVFailureResponse(HashMap<String, Object> response_type) {
    String serialize() {
      Moshi moshi = new Moshi.Builder().build();
      Type objectStringMap = Types.newParameterizedType(Map.class, String.class, Object.class);
      JsonAdapter<Map<String, Object>> adapter = moshi.adapter(objectStringMap);
      return adapter.toJson(response_type);
    }
  }

}


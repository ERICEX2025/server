package edu.brown.cs.student.main.Server;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.CSV.CSVParser;
import edu.brown.cs.student.main.DataObject.CreatorFromRow;
import edu.brown.cs.student.main.DataObject.FactoryFailureException;
import edu.brown.cs.student.main.DataObject.StringList;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

/**
 *
 * endpoint that lets the user load a csv file through a filepath query
 * returns a key value pair {"result", "success"} when successfully loaded
 * or an error response key valur pair {"result", "the specific error"}
 * in the form of json
 * <p>
 * The filepath query must be the filename.csv to safeguard unreasonable filepath
 * Example usage: <a href="http://localhost:3232/loadcsv?filepath=ri_income.csv">...</a>
 */
public class LoadCSVHandler implements Route {

  /**
   * takes in a filepath and loads the inputted csv file by parsing and storing in a
   * List<List<String>> for View and Search handlers to then use
   */
  @Override
  public Object handle(Request request, Response response){
    HashMap<String, Object> toSend = new HashMap<>();

    try{
      FileReader fileReader = new FileReader("Backend/data/" + request.queryParams("filepath"));
      CreatorFromRow<List<String>> stringList = new StringList();
      CSVParser<List<String>> parser = new CSVParser<>(fileReader, stringList);
      Server.setParsedLoadedCSV(parser.parse());
    }
    catch (FileNotFoundException e) {
      toSend.put("result", "error_bad_datasource, CSV File not found in our data folder: " + request.queryParams("filepath"));
      return new LoadCSVFailureResponse(toSend).serialize();
    }
    catch (IOException e) {

      toSend.put("result", "error_datasource, Error occurred while reading file: " + request.queryParams("filepath"));
      return new LoadCSVFailureResponse(toSend).serialize();
    }
    catch (FactoryFailureException e) {
      toSend.put("result", "error_creator_from_row, Failed to create data object from row, fix your CreatorFromRow object ");
      return new LoadCSVFailureResponse(toSend).serialize();
    }

    toSend.put("result", "success");
    toSend.put("csvfile", request.queryParams("filepath"));
    return new LoadCSVSuccessResponse(toSend).serialize();
  }

  public record LoadCSVSuccessResponse(HashMap<String, Object> response_type) {
    String serialize() {
        Moshi moshi = new Moshi.Builder().build();
        Type objectStringMap = Types.newParameterizedType(Map.class, String.class, Object.class);
        JsonAdapter<Map<String, Object>> adapter = moshi.adapter(objectStringMap);
        return adapter.toJson(response_type);
    }

  }

  public record LoadCSVFailureResponse(HashMap<String, Object> response_type) {
    String serialize() {
      Moshi moshi = new Moshi.Builder().build();
      Type objectStringMap = Types.newParameterizedType(Map.class, String.class, Object.class);
      JsonAdapter<Map<String, Object>> adapter = moshi.adapter(objectStringMap);
      return adapter.toJson(response_type);
    }
  }
}



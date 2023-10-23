import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.CSV.CSVParser;
import edu.brown.cs.student.main.DataObject.CreatorFromRow;
import edu.brown.cs.student.main.DataObject.FactoryFailureException;
import edu.brown.cs.student.main.DataObject.StringList;
import edu.brown.cs.student.main.Server.LoadCSVHandler;
//import edu.brown.cs.student.main.Server.LoadCSVHandler.LoadFailureResponse;
//import edu.brown.cs.student.main.Server.LoadCSVHandler.LoadSuccessResponse;
import edu.brown.cs.student.main.Server.LoadCSVHandler.LoadCSVFailureResponse;
import edu.brown.cs.student.main.Server.LoadCSVHandler.LoadCSVSuccessResponse;
import edu.brown.cs.student.main.Server.Server;
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

public class MockLoadCSVHandler implements Route {

  /**
   * takes in a filepath and loads the inputted csv file by parsing and storing in a
   * List<List<String>> for View and Search handlers to then use
   */
  @Override
  public Object handle(Request request, Response response){
    HashMap<String, Object> toSend = new HashMap<>();

    try{
      FileReader fileReader = new FileReader("data/" + request.queryParams("filepath"));
      CreatorFromRow<List<String>> stringList = new StringList();
      CSVParser<List<String>> parser = new CSVParser<>(fileReader, stringList);
      testHandlers.setParsedLoadedCSV(parser.parse());
    }
    catch (FileNotFoundException e) {
      toSend.put("result", "error_bad_datasource, CSV File not found in our data folder: " + request.queryParams("filepath"));
      return new MockLoadCSVHandler.LoadCSVFailureResponse(toSend).serialize();
    }
    catch (IOException e) {

      toSend.put("result", "error_datasource, Error occurred while reading file: " + request.queryParams("filepath"));
      return new MockLoadCSVHandler.LoadCSVFailureResponse(toSend).serialize();
    }
    catch (FactoryFailureException e) {
      toSend.put("result", "error_creator_from_row, Failed to create data object from row, fix your CreatorFromRow object ");
      return new MockLoadCSVHandler.LoadCSVFailureResponse(toSend).serialize();
    }

    toSend.put("result", "success");
    toSend.put("csvfile", request.queryParams("filepath"));
    return new MockLoadCSVHandler.LoadCSVSuccessResponse(toSend).serialize();
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



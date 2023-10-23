import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.Server.Server;
import edu.brown.cs.student.main.Server.ViewCSVHandler;
import edu.brown.cs.student.main.Server.ViewCSVHandler.ViewCSVFailureResponse;
import edu.brown.cs.student.main.Server.ViewCSVHandler.ViewCSVSuccessResponse;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class MockViewCSVHandler implements Route {

  /**
   * Checks if there is an inputted csv file to view, if false, return failure response
   * else turn the loaded and parsed csv file, Server.getParsedLoadedCSV(), into json
   * and return to view
   */
  @Override
  public Object handle(Request request, Response response) {
    HashMap<String, Object> toSend = new HashMap<>();

    if(testHandlers.getParsedLoadedCSV().isEmpty()){
      toSend.put("result", "error_datasource, CSV File datasource not loaded");
      return new MockViewCSVHandler.ViewCSVFailureResponse(toSend).serialize();
    }

    List<List<String>> result = new ArrayList<>();
    ArrayList<String> status = new ArrayList<>();
    status.add("success");
    result.add(status);
    toSend.put("result", result);
    toSend.put("data", testHandlers.getParsedLoadedCSV());
    return new MockViewCSVHandler.ViewCSVSuccessResponse(toSend).serialize();
  }

  public record ViewCSVSuccessResponse(HashMap<String, Object> response_type) {
    String serialize() {
      Moshi moshi = new Moshi.Builder().build();
      Type objectStringMap = Types.newParameterizedType
          (Map.class, String.class, List.class,
              Types.newParameterizedType(List.class, String.class));
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


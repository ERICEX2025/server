import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.CSV.CSVSearcher;
import edu.brown.cs.student.main.Exceptions.IdentifierNotFoundException;
import edu.brown.cs.student.main.Exceptions.TermNotFoundException;
import edu.brown.cs.student.main.Exceptions.TermNotFoundInSpecifiedColumnException;
import edu.brown.cs.student.main.Server.SearchCSVHandler;
import edu.brown.cs.student.main.Server.SearchCSVHandler.SearchCSVFailureResponse;
import edu.brown.cs.student.main.Server.SearchCSVHandler.SearchCSVSuccessResponse;
import edu.brown.cs.student.main.Server.Server;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class MockSearchCSVHandler implements Route {

  @Override
  public Object handle(Request request, Response response) {
    HashMap<String, Object> toSend = new HashMap<>();

    if(request.queryParams("term")==null){
      toSend.put("result", "error_bad_request, Please enter a search term");
      return new MockSearchCSVHandler.SearchCSVFailureResponse(toSend).serialize();
    }
    if(request.queryParams("hasheader")==null){
      toSend.put("result", "error_bad_request, Please include a boolean to indicate if the csv has a header row");
      return new MockSearchCSVHandler.SearchCSVFailureResponse(toSend).serialize();
    }

    if(testHandlers.getParsedLoadedCSV().isEmpty()){
      toSend.put("result", "error_datasource, CSV File datasource not loaded");
      return new MockSearchCSVHandler.SearchCSVFailureResponse(toSend).serialize();
    }
    try{
      List<List<String>> result = new ArrayList<>();

      ArrayList<String> status = new ArrayList<>();
      status.add("success");

      ArrayList<String> parameters = new ArrayList<>();
      parameters.add("Term is " + request.queryParams("term") + ", Boolean is " +
          request.queryParams("hasheader") + ", If identifier exists, identifier is " + request.queryParams("identifier"));

      result.add(status);
      toSend.put("result", result);
      toSend.put("Parameters", parameters);

      List<List<String>> data = new MockCSVSearcher(request.queryParams("term"),
          Boolean.parseBoolean(request.queryParams("hasheader")), request.queryParams("identifier"))
          .search();
      toSend.put("data", data);
      return new MockSearchCSVHandler.SearchCSVSuccessResponse
          (toSend).serialize();
    }
    catch (TermNotFoundException e){
      toSend.put("result","error_bad_request, Term " + request.queryParams("term") + " not found");
      return new MockSearchCSVHandler.SearchCSVFailureResponse(toSend).serialize();
    }
    catch (IdentifierNotFoundException e){
      toSend.put("result","error_bad_request, Identifier " + request.queryParams("identifier") + " does not exist");
      return new MockSearchCSVHandler.SearchCSVFailureResponse(toSend).serialize();
    }
    catch (TermNotFoundInSpecifiedColumnException e){
      toSend.put("result","error_bad_request, Term " + request.queryParams("term") + " does not exist in this identifier " + request.queryParams("identifier"));
      return new MockSearchCSVHandler.SearchCSVFailureResponse(toSend).serialize();
    }
  }

  public record SearchCSVSuccessResponse(HashMap<String, Object> response_type) {
    String serialize() {
      Moshi moshi = new Moshi.Builder().build();
      Type objectStringMap = Types.newParameterizedType
          (Map.class, String.class, List.class,
              Types.newParameterizedType(List.class, String.class));
      JsonAdapter<Map<String, Object>> adapter = moshi.adapter(objectStringMap);
      return adapter.toJson(response_type);
    }

  }

  public record SearchCSVFailureResponse(HashMap<String, Object> response_type) {
    String serialize() {
      Moshi moshi = new Moshi.Builder().build();
      Type objectStringMap = Types.newParameterizedType(Map.class, String.class, Object.class);
      JsonAdapter<Map<String, Object>> adapter = moshi.adapter(objectStringMap);
      return adapter.toJson(response_type);
    }
  }
}

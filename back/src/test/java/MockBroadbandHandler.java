import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.Exceptions.CountyDoesNotExistException;
import edu.brown.cs.student.main.Server.ACSCensusDataSource;
import edu.brown.cs.student.main.Server.BroadBandHandler;
import edu.brown.cs.student.main.Server.BroadBandHandler.BroadBandFailureResponse;
import edu.brown.cs.student.main.Server.BroadBandHandler.BroadBandSuccessResponse;
import edu.brown.cs.student.main.Server.Server;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class MockBroadbandHandler implements Route {

  @Override
  public Object handle(Request request, Response response) throws IOException {
    HashMap<String, Object> toSend = new HashMap<>();
    String state = request.queryParams("state");

    //if no state param
    if (state == null) {
      toSend.put("result", "error_bad_request, please specify a state");
      return new MockBroadbandHandler.BroadBandFailureResponse(toSend).serialize();
    }

    toSend = new MockBroadbandData().getMap();
    //if state does not exist
    return new MockBroadbandHandler.BroadBandSuccessResponse(toSend).serialize();

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
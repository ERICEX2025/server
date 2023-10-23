import java.util.HashMap;
import java.util.List;

import java.util.List;
import java.util.Map;

public record MockBroadbandData() {

    public HashMap<String, Object> getMap(){

          HashMap<String, Object> resultMap = new HashMap<>();
          resultMap.put("Brown University", "CS320");

          return resultMap;

    }

}

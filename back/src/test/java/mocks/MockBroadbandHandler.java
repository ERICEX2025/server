package mocks;

import spark.Request;
import spark.Response;
import spark.Route;

public class MockBroadbandHandler implements Route {
  @Override
  public Object handle(Request req, Response res){
    return "success";
  }
}

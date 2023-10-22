package edu.brown.cs.student.main.DataObject;

import java.util.List;

public class StringList implements CreatorFromRow<List<String>> {

  @Override
  public List<String> create(List<String> row) {
    return row;
  }
}

package edu.brown.cs.student.main.Exceptions;
public class TermNotFoundInSpecifiedColumnException extends Exception{
  final String term;
  final String identifier;
  public TermNotFoundInSpecifiedColumnException(String message, String term, String identifier){
    super(message);
    this.term = term;
    this.identifier = identifier;
  }

}

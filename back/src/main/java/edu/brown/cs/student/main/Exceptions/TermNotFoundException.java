package edu.brown.cs.student.main.Exceptions;

public class TermNotFoundException extends Exception{
  final String term;
  public TermNotFoundException(String message, String term){
    super(message);
    this.term = term;
  }
}

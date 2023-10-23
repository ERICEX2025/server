package edu.brown.cs.student.main.Exceptions;

public class IdentifierNotFoundException extends Exception{
  final String identifier;
  public IdentifierNotFoundException(String message, String identifier){
    super(message);
    this.identifier = identifier;
  }
}

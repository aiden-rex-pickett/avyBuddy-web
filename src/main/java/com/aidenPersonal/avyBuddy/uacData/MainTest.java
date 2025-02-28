package com.aidenPersonal.avyBuddy.uacData;

import java.io.IOException;

public class MainTest {
	
	public static void main(String[] args) {
      Forecast forecast;
      try {
          forecast = new Forecast("salt-lake");
      } catch (IOException e) {
          throw new RuntimeException(e);
      }
      System.out.println(forecast.getavy_danger());
	}
}

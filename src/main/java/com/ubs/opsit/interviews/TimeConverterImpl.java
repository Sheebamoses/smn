package com.ubs.opsit.interviews;

import com.ubs.opsit.interviews.TimeConverter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import static com.ubs.opsit.interviews.TimeConstants.*;

public class TimeConverterImpl implements TimeConverter {

    public String convertTime(String inputTime){
          if (isValid(inputTime)){
              BerlinTime berlinTime = new BerlinTime(inputTime);
              return berlinTime.toString();
          }
          else{
              return ERROR_MESSAGE ;
          }
    };

    /**
     * Validate time
     * @param  inputTime in 24 hours format
     * @return true valid time format, false invalid time format
     */
    public boolean isValid(String inputTime){

        /* fail-fast - return if length check fails e.g. "1:05:34" */
        if (inputTime.length() != 8) {
            return false;
        }
        Pattern pattern;
        Matcher matcher;
        pattern = Pattern.compile(TIME24HOURS_PATTERN);
        matcher = pattern.matcher(inputTime);
        return matcher.matches();
    }

}
package com.aidenPersonal.avyBuddy.uacData;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

/**
 * Serializer for the AvalancheProblem class so it can be created as an ObjectNode
 *
 * @author Aiden Pickett
 * @version 02/27/25
 */
public class AvalancheProblemSerializer extends JsonSerializer<AvalancheProblem> {
    @Override
    public void serialize(AvalancheProblem avalancheProblem, JsonGenerator gen, SerializerProvider serializerProvider) throws IOException {
        gen.writeStartObject();
        gen.writeStringField("problem_title", avalancheProblem.getProblemTitle());
        gen.writeStringField("problem_description", avalancheProblem.getProblemDescription());
        gen.writeArray(avalancheProblem.getDangerArray(), 0, avalancheProblem.getDangerArray().length);
    }
}

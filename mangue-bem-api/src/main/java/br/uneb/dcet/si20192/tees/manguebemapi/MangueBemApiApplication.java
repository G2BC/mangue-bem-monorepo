package br.uneb.dcet.si20192.tees.manguebemapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaAuditing
@EnableJpaRepositories
@SpringBootApplication
public class MangueBemApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(MangueBemApiApplication.class, args);
	}

}

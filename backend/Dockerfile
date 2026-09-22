# Backend imajı. Derleme bağlamı depo kökü: bkz. docker-compose.yml.
#
# Derleme, Maven Wrapper ile yapılır (mvnw kendi Maven'ını indirir): imaj etiketi tahmin etmeye gerek kalmaz
# ve herkes projedeki Maven sürümüyle derler.
FROM eclipse-temurin:25-jdk AS build
WORKDIR /build

# Önce yalnızca bağımlılık tanımları: kaynak değişince bağımlılıklar yeniden indirilmez (katman önbelleği).
COPY backend/.mvn .mvn
COPY backend/mvnw backend/pom.xml ./
RUN ./mvnw -B dependency:go-offline

COPY backend/config config
COPY backend/src src
# Testler burada çalışmaz: Testcontainers'ın kendi Docker'ı gerekir, onlar `./mvnw verify` ile koşar.
RUN ./mvnw -B -DskipTests package

FROM eclipse-temurin:25-jre AS runtime
# Video ve sesli notlar ffmpeg ile işlenir (ffprobe aynı pakettedir). curl sağlık yoklaması için.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg curl \
    && rm -rf /var/lib/apt/lists/*

# Uygulama root olarak çalışmaz. Medya klasörü imajda oluşur: Docker, boş birimi bu sahiplikle başlatır.
RUN useradd --system --create-home --uid 10001 santiye \
    && mkdir -p /data/media \
    && chown -R santiye:santiye /data/media
USER santiye
WORKDIR /app
COPY --from=build /build/target/*.jar app.jar

ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

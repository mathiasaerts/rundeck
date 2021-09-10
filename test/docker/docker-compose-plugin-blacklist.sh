version: '2'

services:
  mysql:
    image: mysql:5.7
    expose:
      - 3306
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=rundeck
      - MYSQL_USER=rundeck
      - MYSQL_PASSWORD=rundeck
    networks:
      localnet:
        ipv4_address: 192.168.234.10
    volumes:
       - ./dockers/mysql/conf:/etc/mysql/conf.d
  rundeck1:
    hostname: rundeck1
    image: rdtest:latest
    links:
      - mysql
    environment:
      - RUNDECK_NODE=rundeck1
      - RUNDECK_URL=http://rundeck1:4440
      - LAUNCHER_URL=${LAUNCHER_URL}
      - CLI_DEB_URL=${CLI_DEB_URL}
      - CLI_VERS=${CLI_VERS}
      - SETUP_TEST_PROJECT=test
      - TEST_NC_PORT=4444
      - TEST_NC_HOST=rundeck1
      - WAIT_NODES=rundeck1
      - CONFIG_SCRIPT_PRESTART=scripts/config-db.sh
      - "STARTUP_FAILURE_MSG=\\(MySQLSyntaxErrorException\\|MariaDbSqlException\\|SQLException\\)"
      - DATABASE_DRIVER=org.mariadb.jdbc.Driver
      - DATABASE_URL=jdbc:mysql://mysql:3306/rundeck?autoReconnect=true&useUnicode=yes&useSSL=false
      - DATABASE_USER=rundeck
      - DATABASE_PASS=rundeck
      - PLUGIN_BLACKLIST_FILE=/home/rundeck/blacklist.yaml
    volumes:
      - logs:/home/rundeck/logs:rw
      - resources:/home/rundeck/resources:rw
      - tests:/home/rundeck/tests:rw
      - ${PWD}/dockers/rundeck/data/blacklist.yaml:/home/rundeck/blacklist.yaml
    networks:
      localnet:
        ipv4_address: 192.168.234.11
    ports:
      - "2222:22"
      - "4440:4440"
      - "4444:4444"
networks:
  localnet:
    driver: bridge
    ipam:
      driver: default
      config:
      - subnet: 192.168.234.0/24
        gateway: 192.168.234.1

volumes:
  logs:
  resources:
  tests:
# Check if MariaDB is healthy
STATUS=$(mysqladmin ping -h127.0.0.1 -uroot -pssafy 2>&1)
if [[ $STATUS == *"mysqld is alive"* ]]; then
  exit 0
else
  exit 1
fi

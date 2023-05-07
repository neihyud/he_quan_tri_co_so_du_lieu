<!-- host = "mongodb+srv://admin:abc12345@cluster0.mmi1upr.mongodb.net/database01" -->
host = "mongodb+srv://cluster0.mmi1upr.mongodb.net"
database = database01
username = "admin"
password = "abc12345"
des = ./backup


mongodump -h cluster0.mmi1upr.mongodb.net -d database01 -u admin -p abc12345 -o ./backup
mongodump --uri mongodb+srv://admin:abc12345@cluster0.mmi1upr.mongodb.net/database01 --archive=mybackup.gz --gzip -o ./backup
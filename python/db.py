from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# TODO breadchris use database to store things?
# Choose a database
DATABASE_URI = 'sqlite:///example.db'

# Create a connection to the database
engine = create_engine(DATABASE_URI, echo=True)

# Define your database schema
Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    age = Column(Integer)

# Create the tables in the database
Base.metadata.create_all(engine)

# Use the database
Session = sessionmaker(bind=engine)
session = Session()

# Create a new user
user = User(name='John Doe', age=30)
session.add(user)
session.commit()

# Query the database
users = session.query(User).all()
for user in users:
    print(user.id, user.name, user.age)

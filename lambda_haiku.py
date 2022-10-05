import os
import openai
from datetime import datetime
import boto3
db = boto3.resource('dynamodb')
table = db.Table('haiku-generator')
openai.api_key=os.environ['OPENAI_KEY']

def gen_haiku(words,language):
  prompt="Write a haiku about \""+words +"\""
  if language=='Japanese':
    prompt+=" in Japanese"
  
  resp = openai.Completion.create(
      model="text-davinci-002",
      prompt=prompt,
      max_tokens=40,
      temperature=0.7,
  )
  try:
    return resp.choices[0].text
  except Exception:
    return 'failed'
 
def lambda_handler(req_event, req_context):
  if not ('queryStringParameters' in req_event and 'words' in req_event['queryStringParameters']):
    return {"statusCode", 204}
  words= req_event["queryStringParameters"]['words']
  language=req_event["queryStringParameters"]['language']
  haiku=gen_haiku(words,language)
  table.put_item(Item={'timestamp':str(datetime.now()),'words':words,'haiku':haiku},ReturnValues='NONE')

  return {'statusCode': 200, 'body': haiku}

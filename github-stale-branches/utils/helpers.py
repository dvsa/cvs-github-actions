from typing import Any
from types import FunctionType

import os, json, time, logging

logger = logging
logger.basicConfig(
   level=logging.INFO,
   format="[%(levelname)s] %(message)s"
)

def cache(func: FunctionType) -> Any:
  def fetch(file, **kwargs) -> Any:
      if not file:
         raise Exception("No Filename Provided")
    
      cachedir: str = "cache"
      filename: str = f"{file}.json"

      if not os.path.exists(cachedir):
         os.makedirs(cachedir)
         
      if os.path.exists(os.path.join(cachedir, filename)):
         logger.info(f"Reading cached {filename}")
         result = json.loads(open(os.path.join(cachedir, filename)).read())
      else:
         logger.info(f"Caching {filename} from server (this may take some time...)")
         result: Any = func(file, **kwargs)
         result = result if not type(result) is set else list(result)
         with open(os.path.join(cachedir, filename), "w") as f:
               f.write(json.dumps(result))
      return result
  return fetch

def time_process(func: FunctionType) -> Any:
   def timer(*args, **kwargs) -> Any:
      start = time.time()
      result = func(*args, **kwargs)
      logger.info(f"Time: {time.time() - start}")
      return result
   return timer
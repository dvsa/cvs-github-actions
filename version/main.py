import semver, argparse
from datetime import date

def bump_semver(bump, version):
  ver = semver.Version.parse(version)
  match bump:
    case "major":
      return ver.bump_major()
    case "minor":
      return ver.bump_minor()
    case "patch":
      return ver.bump_patch()

def bump_date_ver(version):
  ver = date.today()
  datver = "{0}-{1:02d}-{2:02d}.".format( ver.year, ver.month, ver.day )
  if (version.startswith(datver)):
    build = int(version.split('.')[-1]) + 1
    return "{0}{1}".format(datver, build)
  else:
    return "{0}0".format(datver)
  
if __name__=="__main__":
  parser = argparse.ArgumentParser()
  parser.add_argument("-b", "--bump", type=str)
  parser.add_argument("-v", "--version", type=str)
  parser.add_argument("-t", "--type", type=str)

  args = parser.parse_args()
  
  match args.type:
    case "semver":
      print(bump_semver(args.bump, args.version))
    case "datver":
      print(bump_date_ver(args.version))
    case _:
      raise ValueError("Invalid version type: {}".format(args.type))
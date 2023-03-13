import re
import json

def generateObject(name, description, type, id, seperator=False):
    if name == "":
        return
    name = re.sub("\\u2019", "'", name)
    name = re.sub("\\ufeff", "", name)
    d = re.sub("\\u2019", "'", description) 
    d = re.sub("\\u2018", "'", d)
    d = re.sub("\\u2014", "'", d)
    d = re.sub("\\u201d", "'", d)
    d = re.sub("\\u201c", "'", d)
    d = re.sub("\\u2026", "...", d)
    d = re.sub("Key", "key", d)

    obj = {}
    obj["full"] = (name+":"+d).lower()
    d = d.strip()
    
    if type == "key":
        obj["activate"] = d.split("BUYOFF: ")[0].split(
            "Hit your key")[-1].strip().capitalize()
        obj["description"] = d.split("Hit your key")[0].strip()
        obj["buyoff"] = d.split("BUYOFF: ")[1].strip()
    if type == "secret":
        obj["description"] = d.split("REQUIRES")[0].strip()
        obj["requires"] = d.split("REQUIRES: ")[1].strip()
    if type == "trait":
        obj["description"] = d
    obj["name"] = name
    obj["id"] = id
    obj["type"] = type 

    return obj

def getObject(filename, validationFunction, type, seperators = False):
    list = []
    file = open(filename, "r", encoding="utf8")
    name = ""
    description = ""
    i = 0
    for line in file:
        if validationFunction(line):
            a = generateObject(name, description, type, type[0]+str(i), seperators)
            if a != None:
                list.append(a)
            description = ""
            name = line.strip()
        else:
            description = description + " " + line.strip()
        i += 1
    return json.dumps(list, indent=5)
    
def isTagName(x):
    if (x[-2] in ["-", ","]):
        return False
    if (x[-2] == ")"):
        return True
    if re.search(",", x):
        return False
    return len(x.split()) < 3

def cleanTags(y):
    x = json.loads(y)
    for i in range(0, len(x)):
        try:
            if x[i]["description"] == "":
                x[i-1]["description"] = x[i-1]["description"]+" "+x[i]["name"]
                x[i-1]["full"]=x[i-1]["full"]+ " " + x[i]["name"]
            
                del x[i]
        except:
            pass    
    return json.dumps(x, indent=5)
            
def main():
    with open("keys.json", "w") as outfile:
        outfile.write(getObject("keys.txt", lambda x: re.search(
        "The Key", x), "key", ["Hit your key ", "BUYOFF: "]))

    with open ("secrets.json", "w") as outfile:
        outfile.write(
            getObject("secrets.txt", lambda x: re.search(
                "The Secret", x), "secret", ["REQUIRES: "]))

    with open ("traits.json", "w") as outfile:
        outfile.write(cleanTags(getObject("traits.txt", lambda x: isTagName(x), "trait")))

main()


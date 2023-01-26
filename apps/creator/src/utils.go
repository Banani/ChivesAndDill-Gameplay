package main

import "encoding/json"

func prepareUpdatePayload[T any](moduleName string, items map[string]T) map[string]EnginePackageStringArray {
	updatePackage := make(map[string]EnginePackageStringArray)
	serializedModule := make(map[string]string)

	for key, item := range items {
		jsonItem, _ := json.Marshal(item)
		serializedModule[key] = string(jsonItem)
	}

	updatePackage[moduleName] = EnginePackageStringArray{Data: serializedModule}
	return updatePackage
}

func prepareDeletePayload(moduleName string, itemIds []string) map[string]EnginePackageStringArray {
	updatePackage := make(map[string]EnginePackageStringArray)
	serializedModule := make(map[string]interface{})

	for _, key := range itemIds {
		serializedModule[key] = nil
	}

	updatePackage[moduleName] = EnginePackageStringArray{ToDelete: serializedModule}
	return updatePackage
}

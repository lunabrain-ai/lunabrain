package workflowmanager

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"testing"

	"github.com/stretchr/testify/assert"
)

/*
Expected graphs:
2020/09/30 07:48:21 7ae16bff-e7e7-433b-9ca5-c41d33585ff8
2020/09/30 07:48:21 - Block Activity: lambda arn:aws:lambda:us-west-2:623905218559:function:Untitled_Code_Block02677370-f519-4f75-9f1d-51aaad8c0b81
2020/09/30 07:48:21 cf63dbbc-0de4-4c53-937d-cdd5eeb6cc75
2020/09/30 07:48:21 - Block Activity: lambda arn:aws:lambda:us-west-2:623905218559:function:Untitled_Code_Blockd5c14395-eb40-48b7-8f9b-72eab34dfc4c
2020/09/30 07:48:21 199a6416-5b2f-476c-ba30-cb0c6eb4fe59
2020/09/30 07:48:21 - Execution Sequence: parallel
2020/09/30 07:48:21 -- Block Activity: lambda arn:aws:lambda:us-west-2:623905218559:function:Untitled_Code_Blockedc25dc9-8093-495a-8598-e320aa7c0f0d
2020/09/30 07:48:21 -- Block Activity: lambda arn:aws:lambda:us-west-2:623905218559:function:Untitled_Code_Block369a7480-cc71-405e-b945-b9f90792729d
2020/09/30 07:48:21 36350e19-49f9-4d98-acea-a68be3a8f7a0
2020/09/30 07:48:21 - Execution Sequence: parallel
2020/09/30 07:48:21 -- Block Activity: lambda arn:aws:lambda:us-west-2:623905218559:function:queue_handlerfe3dcf75-bbcd-4f10-816d-b0e501c08ac8
2020/09/30 07:48:21 -- Block Activity: lambda arn:aws:lambda:us-west-2:623905218559:function:queue_handler279ac74a9-819a-4ceb-9ac5-1527c4ca6715
2020/09/30 07:48:21 7ee1c6e4-5f3d-4189-a88e-ca8e1bb5858d
2020/09/30 07:48:21 - Execution Sequence: sequence
2020/09/30 07:48:21 -- Block Activity: lambda arn:aws:lambda:us-west-2:623905218559:function:Block_A2652463f-c568-4bdb-9879-21a8f069f653
2020/09/30 07:48:21 -- Execution Sequence: parallel
2020/09/30 07:48:21 --- Execution Sequence: sequence
2020/09/30 07:48:21 ---- Block Activity: lambda arn:aws:lambda:us-west-2:623905218559:function:Block_Bbf0203e7-1a2f-4124-b219-e557c4844ec6
2020/09/30 07:48:21 ---- Block Activity: lambda arn:aws:lambda:us-west-2:623905218559:function:Block_D30b66565-1d04-4bc3-8480-352d2d4661e9
2020/09/30 07:48:21 ---- Block Activity: lambda arn:aws:lambda:us-west-2:623905218559:function:Block_F5926fdab-df5a-472f-a1fe-5f9da6317720
2020/09/30 07:48:21 --- Execution Sequence: sequence
2020/09/30 07:48:21 ---- Block Activity: lambda arn:aws:lambda:us-west-2:623905218559:function:Block_C6302cd4c-ee40-4337-a8c0-2a69f5c47db8
2020/09/30 07:48:21 ---- Block Activity: lambda arn:aws:lambda:us-west-2:623905218559:function:Block_D30b66565-1d04-4bc3-8480-352d2d4661e9
2020/09/30 07:48:21 ---- Block Activity: lambda arn:aws:lambda:us-west-2:623905218559:function:Block_F5926fdab-df5a-472f-a1fe-5f9da6317720
2020/09/30 07:48:21 e1e8a66a-381b-4c01-b00a-a0ac93493974
2020/09/30 07:48:21 - Block Activity: lambda arn:aws:lambda:us-west-2:623905218559:function:Untitled_Code_Blocke7127e00-1590-447e-95ef-e8cb4655e05b
*/

func TestLoadWorkflowFromRefineryJSON(t *testing.T) {
	deploymentJSONData, err := ioutil.ReadFile("fixtures/testing/deployment4.json")
	assert.Nil(t, err)

	var deploymentJSON DeploymentJSON
	err = json.Unmarshal(deploymentJSONData, &deploymentJSON)
	assert.Nil(t, err)

	workflows := loadWorkflowFromRefineryJSON(deploymentJSON)
	assert.Nil(t, err)

	for id, workflow := range workflows {
		log.Println(id)
		printDSLStatement(&workflow.Root)
	}
}

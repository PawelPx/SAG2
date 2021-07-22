using NUnit.Framework;
using System;
using System.Data;
using System.Data.SqlClient;

namespace SAG2Tests
{
    public class LocalTest : CalculationTest
    {
        override public void Initialize()
        {
            setParameters("Sword", 1400, 22, 33, 6, 16, 80, 21, 98, 8, 70, 112);
            driver.Navigate().GoToUrl("https://localhost:44316/");
            driver.Manage().Window.Maximize();
        }

        override public void restOfTheTest()
        {
            // check what's in database
            string query = "Select top 1 * from Sword order by Id desc";
            var result = getQueryResult(query);

            // received values
            string receivedName = result.Rows[0]["Name"].ToString();
            float receivedMass = float.Parse(result.Rows[0]["Mass"].ToString());
            float receivedGripReference = float.Parse(result.Rows[0]["GripReference"].ToString());
            float receivedCenterOfMass = float.Parse(result.Rows[0]["CenterOfMass"].ToString());
            float receivedLeverReference = float.Parse(result.Rows[0]["LeverReference"].ToString());
            float receivedHiltNode = float.Parse(result.Rows[0]["HiltNode"].ToString());
            float receivedBladeNode = float.Parse(result.Rows[0]["BladeNode"].ToString());
            float receivedActionPoint1 = float.Parse(result.Rows[0]["ActionPoint1"].ToString());
            float receivedPivotPoint1 = float.Parse(result.Rows[0]["PivotPoint1"].ToString());
            float receivedActionPoint2 = float.Parse(result.Rows[0]["ActionPoint2"].ToString());
            float receivedPivotPoint2 = float.Parse(result.Rows[0]["PivotPoint2"].ToString());
            float receivedOverallLength = float.Parse(result.Rows[0]["OverallLength"].ToString());

            // test Db
            Assert.AreEqual(expectedName, receivedName);
            Assert.AreEqual(expectedMass, receivedMass);
            Assert.AreEqual(expectedGripReference, receivedGripReference);
            Assert.AreEqual(expectedCenterOfMass, receivedCenterOfMass);
            Assert.AreEqual(expectedLeverReference, receivedLeverReference);
            Assert.AreEqual(expectedHiltNode, receivedHiltNode);
            Assert.AreEqual(expectedBladeNode, receivedBladeNode);
            Assert.AreEqual(expectedActionPoint1, receivedActionPoint1);
            Assert.AreEqual(expectedPivotPoint1, receivedPivotPoint1);
            Assert.AreEqual(expectedActionPoint2, receivedActionPoint2);
            Assert.AreEqual(expectedPivotPoint2, receivedPivotPoint2);
            Assert.AreEqual(expectedOverallLength, receivedOverallLength);
        }


        public DataTable getQueryResult(String query)
        {
            SqlConnection Connection;  // It is for SQL connection
            DataSet ds = new DataSet();  // it is for store query result

            try
            {
                Connection = new SqlConnection(@"Server=DESKTOP-DVTFMOJ;Database=SAG2Db;Trusted_Connection=True;");  // Declare SQL connection with connection string
                //Connection = new SqlConnection(@"Server=(localdb)\\mssqllocaldb;Database=aspnet-SAG2-53bc9b9d-9d6a-45d4-8429-2a2761773502;Trusted_Connection=True;MultipleActiveResultSets=true");
                Connection.Open();

                SqlDataAdapter adp = new SqlDataAdapter(query, Connection);  // Execute query on database 
                adp.Fill(ds);  // Store query result into DataSet object   
                Connection.Close();  // Close connection 
                Connection.Dispose();   // Dispose connection
            }
            catch (Exception E)
            {
                Console.WriteLine("Error in getting result of query.");
                Console.WriteLine(E.Message);
                return new DataTable();
            }
            return ds.Tables[0];
        }
    }
}



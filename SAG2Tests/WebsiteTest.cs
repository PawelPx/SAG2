using System;
using System.Data;
using System.Data.SqlClient;

namespace SAG2Tests
{
    public class WebsiteTest : CalculationTest
    {
        override public void Initialize()
        {
            setParameters("Sword", 1400, 22, 33, 6, 16, 80, 21, 98, 8, 70, 112);
            driver.Navigate().GoToUrl("http://saggenerator.azurewebsites.net/");
            driver.Manage().Window.Maximize();
        }

        override public void restOfTheTest()
        {

        }
    }
}
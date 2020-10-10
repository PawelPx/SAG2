using Microsoft.EntityFrameworkCore.Migrations;

namespace SAG2.Data.Migrations
{
    public partial class Swords : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Sword",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true),
                    Mass = table.Column<string>(nullable: true),
                    GripReference = table.Column<string>(nullable: true),
                    CenterOfMass = table.Column<string>(nullable: true),
                    LeverReference = table.Column<string>(nullable: true),
                    HiltNode = table.Column<string>(nullable: true),
                    BladeNode = table.Column<string>(nullable: true),
                    ActionPoint1 = table.Column<string>(nullable: true),
                    PivotPoint1 = table.Column<string>(nullable: true),
                    ActionPoint2 = table.Column<string>(nullable: true),
                    PivotPoint2 = table.Column<string>(nullable: true),
                    OverallLength = table.Column<string>(nullable: true),
                    Style = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sword", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Sword_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Sword_UserId",
                table: "Sword",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Sword");
        }
    }
}

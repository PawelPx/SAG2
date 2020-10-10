using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using SAG2.Data;
using SAG2.Models;

namespace SAG2.Pages.Swords
{
    [Authorize]
    public class CreateModel : PageModel
    {
        private readonly SAG2.Data.ApplicationDbContext _context;

        public CreateModel(SAG2.Data.ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult OnGet()
        {
        ViewData["UserId"] = new SelectList(_context.Users, "Id", "Id");
            return Page();
        }

        [BindProperty]
        public Sword Sword { get; set; }

        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        public async Task<IActionResult> OnPostAsync()
        {
            Sword.UserId = _context.Users.Where(s => s.UserName == User.Identity.Name).Select(x => x.Id).Single();

            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.Sword.Add(Sword);
            await _context.SaveChangesAsync();

            return RedirectToPage("./Index");
        }
    }
}

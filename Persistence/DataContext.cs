using Microsoft.EntityFrameworkCore;
using System;
using Domain;


namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
            
        }

        public DbSet<Value> Values { get; set; }
        public DbSet<Activity> Activities { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Value>().HasData(
                    new Value { ID = 1, Name = "Value 01" },
                    new Value { ID = 2, Name = "Value 02" },
                    new Value { ID = 3, Name = "Value 03" }
                );
        }
    }
}

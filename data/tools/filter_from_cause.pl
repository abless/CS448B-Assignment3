#!/usr/bin/perl

open FIN, "<".$ARGV[0];

my @causeList = ();
for ($i = 0; $i < $ARGV[1]; $i ++)
{
    $line = <FIN>;
    @line = split(/;/, $line);

    $causeList{$line[0]} = 1;
}

$line = <STDIN>;
print $line;

while(<STDIN>)
{
    #@line = split(/,/, $_);
    if ($_ =~ /(.+),(".+"),([12]),(.+),([0-9]+)/)
    {
        if ($causeList{$2} == 1)
        {
            print;
        }
    }
    else
    {
        print "Error\n";
    }
}


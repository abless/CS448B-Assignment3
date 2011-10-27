#!/usr/bin/perl

open FIN, "<".$ARGV[0];

my @causeList = ();
for ($i = 0; $i < 10; $i ++)
{
    $line = <FIN>;
    @line = split(/;/, $line);

    $causeList{$line[0]} = 1;
}

$line = <STDIN>;
print $line;

while(<STDIN>)
{
    @line = split(/;/, $_);
    if ($causeList{$line[1]} == 1)
    {
        print;
    }
}

